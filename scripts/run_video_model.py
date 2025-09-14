#!/usr/bin/env python
# Run Video MAE using kinetics_classifier_demo's built-in arg parser

from qai_hub_models.models._shared.video_classifier.demo import kinetics_classifier_demo
from qai_hub_models.models.video_mae.app import VideoMAEApp
from qai_hub_models.models.video_mae.model import VideoMAE

def main():
    kinetics_classifier_demo(
        model_type=VideoMAE,
        default_video=None,  # will be overridden by --video if provided
        is_test=False,
        app_cls=VideoMAEApp,
    )

if __name__ == "__main__":
    main()
