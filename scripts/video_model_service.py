import sys
import traceback
from qai_hub_models.models.video_mae.app import VideoMAEApp
from qai_hub_models.models.video_mae.model import VideoMAE

# A utility function to write to stderr and flush
def log_error(message):
    print(message, file=sys.stderr)
    sys.stderr.flush()

def main():
    """
    Main function to load the model and process video paths from stdin.
    """
    try:
        # 1. Load the model ONCE at the start.
        print("Loading VideoMAE model into memory...", file=sys.stderr)
        sys.stderr.flush()
        app = VideoMAEApp(model=VideoMAE.from_pretrained())
        print("Model loaded successfully. Ready for inference.", file=sys.stderr)
        sys.stderr.flush()
    except Exception as e:
        log_error(f"FATAL: Could not load model. Error: {e}")
        log_error(traceback.format_exc())
        return

    # 2. Enter an infinite loop to listen for video paths on stdin.
    for line in sys.stdin:
        try:
            # The video path is sent from Node.js, stripped of any newline characters.
            video_path = line.strip()

            # An empty line could signal an issue, so we skip it.
            if not video_path:
                continue

            # 3. Perform prediction using the pre-loaded model.
            prediction = app.predict(path=video_path)

            # 4. Print the raw prediction string to stdout.
            # The output format is "Top 5 predictions: class1, class2, ..."
            print(prediction)

            # 5. CRUCIAL: Flush stdout to ensure the Node.js parent process
            # receives the output immediately.
            sys.stdout.flush()

        except Exception as e:
            # If an error occurs during prediction, log it to stderr
            # so Node.js can see it, but continue the loop for the next video.
            log_error(f"Error during prediction for '{video_path}'. Error: {e}")
            log_error(traceback.format_exc())

if __name__ == "__main__":
    main()
    