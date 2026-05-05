# Ayon Harmony Pose Copier 

# Overview

This addon integrates the Pose Copier into Ayon.

Pose Copier is a Harmony tool that allows you to apply poses to a selected rig and frame. Loading templates requires manually browsing Harmony's Asset Browser.
The intergration addon use Ayon's API to query the pose bank and get the templates corresponding to the assets present in the scene. 

# Settings

Set `Product Variant` in the project or studio settings (e.g. `Main`) to match the desired template, based on the product name.
`Product Type` is used to match templates by product type, also based on the product name.

Core addon needs to be set as `>=1.7.2`, and at `ayon+settings://core/tools/creator/product_name_profiles/0/product_base_types` set `harmony.template` and at `...product_name_profiles/0/template` set `harmony_template_{variant}`.
Harmony addon needs to be set as `>=0.4.10`, and at `ayon+settings://harmony/load/TemplateLoader/override_name` set `{folder[name]}_{product[name]}`.

# Usage

Open the Pose Copier menu from the AYON menu.

Make sure the correct drawing is selected in the timeline and the right frame is active.

Click Paste to apply a pose.



