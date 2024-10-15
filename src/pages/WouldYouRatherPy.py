import cv2
import sys

def play_video(video_path):
    # Open the video file
    cap = cv2.VideoCapture(video_path)

    # Check if the video file was opened successfully
    if not cap.isOpened():
        print("Error opening video file")
        return

    # Read and display video frames
    while cap.isOpened():
        ret, frame = cap.read()
        if ret:
            # Display the frame
            cv2.imshow('Video Player', frame)

            # Press 'q' to quit
            if cv2.waitKey(25) & 0xFF == ord('q'):
                break
        else:
            break

    # Release the video capture object and close windows
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <path_to_video_file>")
    else:
        video_path = sys.argv[1]
        play_video(video_path)