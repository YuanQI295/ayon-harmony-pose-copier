# Required: lower case addon name e.g. 'deadline', otherwise addon
#   will be invalid
name = "pose-copier"

# Optional: Addon title shown in UI, 'name' is used by default e.g. 'Deadline'
title = "Pose Copier"

# Required: Valid semantic version (https://semver.org/)
version = "0.1.0+dev"

# Name of client code directory imported in AYON launcher
# - do not specify if there is no client code
client_dir = "pose_copier"

# Version compatibility with AYON server
ayon_server_version = ">=1.9.0"
# Version compatibility with AYON launcher
ayon_launcher_version = ">=1.3.3"

# Mapping of addon name to version requirements
# - addon with specified version range must exist to be able to use this addon
ayon_required_addons = {
    "core": ">=1.7.2",
}
# Mapping of addon name to version requirements
# - if addon is used in same bundle the version range must be valid
ayon_compatible_addons = {
    "harmony": ">=0.4.10",
}
