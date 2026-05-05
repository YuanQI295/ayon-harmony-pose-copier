import os
from pathlib import Path
import subprocess
import zipfile
import ayon_harmony.api as harmony
from ayon_core.settings import get_project_settings
from ayon_core.addon import AYONAddon
from ayon_core.lib import register_event_callback
from ayon_core.pipeline.anatomy import Anatomy
from ayon_core.pipeline.create import get_product_name
from ayon_api import (
    get_project,
    get_folder_by_path,
    get_representations,
    get_last_version_by_product_name,
    get_task_by_name,
    get_representation_hierarchy,
)
from .version import __version__
from ayon_core.pipeline.context_tools import (
    get_current_host_name,
    get_current_folder_entity,
    get_current_task_name,
)


class PoseCopierAddon(AYONAddon):
    label = "Pose Copier"
    name = "pose_copier"
    version = __version__

    def on_harmony_launched_completed(self, event):
        """Callback for Harmony launched completed."""
        harmony.send(
            {
                "script": Path(__file__)
                .parent.joinpath("hosts", "harmony", "ui.js")
                .read_text()
            }
        )

    def on_host_install(self, host, host_name, project_name):
        if host_name == "harmony":
            register_event_callback(
                "application.launched", self.on_harmony_launched_completed
            )


def open_pose_copier(harmony_path: str):
    """Open the Pose Copier inside Harmony.

    Send and execute the Pose Copier JavaScript inside Harmony.

    Args:
        harmony_path (str): path of the harmony executable file.
    """
    pose_copier_js_dir = Path(__file__).parent / "TB_Pose_Copier.js"

    harmony.send({"script": f"""
    preferences.setString("AYON_HARMONY_POSECOPIER_UI_DIR","{pose_copier_js_dir.with_suffix(".ui").as_posix()}");
    var scriptPath = "{pose_copier_js_dir.as_posix()}";

    var file = new File(scriptPath);
    file.open(FileAccess.ReadOnly);
    var pose_copier_js = file.read();
    file.close();

    eval(pose_copier_js);
    """})
    template_paths = get_template_by_product()
    ensure_thumbnails(harmony_path, template_paths)
    load_tpls_into_pose_copier(template_paths)


def load_tpls_into_pose_copier(template_paths: dict):
    """Send template paths to the Pose Copier UI in Harmony.

    Args:
        template_paths (dict): character folder name and their template path.
    """
    for name, path in template_paths.items():
        harmony.send({"script": f"""
        PoseCopierUI.updateTemplateList({{
            name: "{name}",
            path: "{path}"
        }});
        """})


def get_folders_from_scene() -> list:
    """Get Harmony scene containers and resolve representation folder paths.

    Returns:
        list: the paths of the character folders.
    """
    project_name = os.getenv("AYON_PROJECT_NAME")
    representation_ids = [
        item.get("representation") for item in harmony.ls() if "representation" in item
    ]

    folder_paths = []
    for rep_id in representation_ids:
        folder_paths.append(
            get_representation_hierarchy(project_name, rep_id).folder["path"]
        )

    return folder_paths


def extract_tpl_from_zip(path: str, extraction_dir: str) -> Path:
    """Extract .tpl from the zip file.

    Args:
        path (str): path of zip file.
        extraction_dir (str): directory to extract the zip.

    Returns:
        Path: path of the template.
    """
    with zipfile.ZipFile(path, "r") as zip:
        zip.extractall(extraction_dir)

    return next(Path(extraction_dir).glob("*.tpl"))


def get_template_by_product() -> dict:
    """Get the latest version template by product.

    Returns:
        dict: character name and the path of the extracted template.
    """
    project_name = os.getenv("AYON_PROJECT_NAME")
    pose_copier_settings = get_project_settings(project_name).get("pose-copier", {})

    template_path_by_product = {}

    for folder_path in get_folders_from_scene():
        current_task_name = get_current_task_name()

        product = get_last_version_by_product_name(
            project_name,
            get_product_name(
                project_name,
                current_task_name,
                get_task_by_name(
                    project_name,
                    get_current_folder_entity(fields=["id"])["id"],
                    current_task_name,
                    fields=["taskType"],
                )["taskType"],
                get_current_host_name(),
                pose_copier_settings.get("product_type", ""),
                pose_copier_settings.get("product_variant", ""),
            ),
            get_folder_by_path(project_name, folder_path)["id"],
        )

        representations = get_representations(
            project_name, version_ids=[product.get("id")], representation_names=["tpl"]
        )

        for representation in representations:
            zip_path_filled = Anatomy(
                project_name=project_name, project_entity=get_project(project_name)
            ).fill_root(representation["files"][0]["path"])

            extraction_path = Path(harmony.lib.get_local_harmony_path(zip_path_filled))
            tpl_file = next(extraction_path.glob("*.tpl"), None)

            template_path_by_product[Path(folder_path).name] = (
                tpl_file.as_posix()
                if tpl_file is not None
                else extract_tpl_from_zip(
                    zip_path_filled, extraction_path.as_posix()
                ).as_posix()
            )

    return template_path_by_product


def ensure_thumbnails(harmony_path: str, template_paths: dict):
    """Ensure thumbnails exist for each template, and generate them if not.

    Args:
        harmony_path (str): path of the harmony executable file.
        template_paths (dict): character folder name and their template path.
    """
    for name, path in template_paths.items():
        template_path = Path(path)
        thumbnail_dir = template_path / ".thumbnails"
        if not thumbnail_dir.exists():
            subprocess.run(
                [harmony_path, "-template", template_path.as_posix(), "-thumbnails"]
            )
