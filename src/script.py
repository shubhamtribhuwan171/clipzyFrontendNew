import os
import uuid
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageDraw, ImageFont
import sys
import json
import requests
from moviepy.editor import VideoFileClip, AudioFileClip, concatenate_videoclips, CompositeVideoClip, TextClip, ImageSequenceClip
from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs

# Retrieve the API key from environment variables
ELEVENLABS_API_KEY = "sk_adc87bd4bc0abc7a21ddbdeb5c8868070d2510a4dcdcb8f5"
client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

def text_to_speech_file(text: str) -> str:
    response = client.text_to_speech.convert(
        voice_id="pNInz6obpgDQGcFmaJgB",  # Adam pre-made voice
        output_format="mp3_22050_32",
        text=text,
        model_id="eleven_turbo_v2_5",  # Use the turbo model for low latency
        voice_settings=VoiceSettings(
            stability=0.0,
            similarity_boost=1.0,
            style=0.0,
            use_speaker_boost=True,
        ),
    )

    save_file_path = f"{uuid.uuid4()}.mp3"

    with open(save_file_path, "wb") as f:
        for chunk in response:
            if chunk:
                f.write(chunk)

    print(f"{save_file_path}: A new audio file was saved successfully!")

    return save_file_path

def crop(img, x, y, w, h):
    x0, y0 = max(0, x - w // 2), max(0, y - h // 2)
    x1, y1 = x0 + w, y0 + h
    return img[y0:y1, x0:x1]

def apply_effects(image, brightness=1.0, contrast=1.0):
    pil_img = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    enhancer = ImageEnhance.Brightness(pil_img)
    pil_img = enhancer.enhance(float(brightness))
    enhancer = ImageEnhance.Contrast(pil_img)
    pil_img = enhancer.enhance(float(contrast))
    return cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

def apply_ken_burns_effect(img, video_dim, fps, duration, start_center, end_center, start_scale, end_scale):
    orig_shape = img.shape[:2]
    num_frames = int(fps * duration)
    frames = []

    for alpha in np.linspace(0, 1, num_frames):
        rx = end_center[0] * alpha + start_center[0] * (1 - alpha)
        ry = end_center[1] * alpha + start_center[1] * (1 - alpha)
        x = int(orig_shape[1] * rx)
        y = int(orig_shape[0] * ry)
        scale = end_scale * alpha + start_scale * (1 - alpha)

        if orig_shape[1] / orig_shape[0] > video_dim[0] / video_dim[1]:
            h = int(orig_shape[0] * scale)
            w = int(h * video_dim[0] / video_dim[1])
        else:
            w = int(orig_shape[1] * scale)
            h = int(w * video_dim[1] / video_dim[0])

        cropped = crop(img, x, y, w, h)
        scaled = cv2.resize(cropped, dsize=video_dim, interpolation=cv2.INTER_LINEAR)
        frames.append(scaled)

    return frames

def apply_zoom_effect(image, video_dim, fps, duration):
    orig_shape = image.shape[:2]
    num_frames = int(fps * duration)
    frames = []
    start_scale = 0.5
    end_scale = 1.0

    for alpha in np.linspace(0, 1, num_frames):
        scale = start_scale + (end_scale - start_scale) * alpha
        new_w = int(orig_shape[1] * scale)
        new_h = int(orig_shape[0] * scale)
        cropped = crop(image, orig_shape[1] // 2, orig_shape[0] // 2, new_w, new_h)
        scaled = cv2.resize(cropped, dsize=video_dim, interpolation=cv2.INTER_LINEAR)
        frames.append(scaled)
    
    return frames

def apply_rotation_effect(image, video_dim, fps, duration):
    orig_shape = image.shape[:2]
    num_frames = int(fps * duration)
    frames = []
    angle_step = 360 / num_frames

    for i in range(num_frames):
        angle = i * angle_step
        M = cv2.getRotationMatrix2D((orig_shape[1] / 2, orig_shape[0] / 2), angle, 1)
        rotated = cv2.warpAffine(image, M, (orig_shape[1], orig_shape[0]), borderMode=cv2.BORDER_REFLECT)
        scaled = cv2.resize(rotated, dsize=video_dim, interpolation=cv2.INTER_LINEAR)
        frames.append(scaled)
    
    return frames

def apply_blur_effect(image, video_dim, fps, duration):
    num_frames = int(fps * duration)
    frames = []
    blur_step = 10  # Change this value to adjust blur intensity

    for i in range(num_frames):
        blur_value = int((i + 1) * blur_step / num_frames)
        blurred = cv2.GaussianBlur(image, (blur_value * 2 + 1, blur_value * 2 + 1), 0)
        scaled = cv2.resize(blurred, dsize=video_dim, interpolation=cv2.INTER_LINEAR)
        frames.append(scaled)
    
    return frames

def apply_grayscale_effect(image, video_dim, fps, duration):
    num_frames = int(fps * duration)
    frames = []
    
    for i in range(num_frames):
        alpha = i / float(num_frames)
        color_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        colored = cv2.cvtColor(color_img, cv2.COLOR_GRAY2BGR)
        blended = cv2.addWeighted(image, 1 - alpha, colored, alpha, 0)
        scaled = cv2.resize(blended, dsize=video_dim, interpolation=cv2.INTER_LINEAR)
        frames.append(scaled)
    
    return frames

def apply_color_tint_effect(image, video_dim, fps, duration):
    num_frames = int(fps * duration)
    frames = []
    
    for i in range(num_frames):
        alpha = i / float(num_frames)
        tint = np.array([0, 0, 255])  # Red tint
        tinted = cv2.addWeighted(image, 1 - alpha, tint, alpha, 0)
        scaled = cv2.resize(tinted, dsize=video_dim, interpolation=cv2.INTER_LINEAR)
        frames.append(scaled)
    
    return frames

def add_slide_transition(frames1, frames2, fps, duration, direction='left'):
    transition_frames = int(fps * duration)
    blended_frames = []
    for i in range(transition_frames):
        alpha = i / float(transition_frames)
        offset = int((1 - alpha) * frames1[0].shape[1])
        
        if direction == 'left':
            frame = np.hstack((frames2[0][:, offset:], frames1[-1][:, :offset]))
        elif direction == 'right':
            frame = np.hstack((frames1[-1][:, -offset:], frames2[0][:, :-offset]))
        elif direction == 'up':
            frame = np.vstack((frames2[0][offset:, :], frames1[-1][:offset, :]))
        elif direction == 'down':
            frame = np.vstack((frames1[-1][-offset:, :], frames2[0][:-offset, :]))
        
        blended_frames.append(frame)
    
    return blended_frames

def apply_text_effect(draw, text, position, font, style):
    effect = style.get('textEffect', 'None')
    intensity = style.get('effectIntensity', 50)
    color = style.get('textColor', '#FFFFFF')
    stroke_color = style.get('textStrokeColor', '#000000')
    stroke_width = style.get('textStrokeWidth', 0)

    if effect == 'Outline':
        for offset in range(1, stroke_width + 1):
            draw.text((position[0] - offset, position[1]), text, font=font, fill=stroke_color)
            draw.text((position[0] + offset, position[1]), text, font=font, fill=stroke_color)
            draw.text((position[0], position[1] - offset), text, font=font, fill=stroke_color)
            draw.text((position[0], position[1] + offset), text, font=font, fill=stroke_color)
    elif effect == 'Shadow':
        shadow_offset = int(intensity / 10)
        draw.text((position[0] + shadow_offset, position[1] + shadow_offset), text, font=font, fill=stroke_color)
    elif effect == 'Glow':
        glow_iterations = int(intensity / 10)
        for i in range(glow_iterations, 0, -1):
            alpha = int(255 * (i / glow_iterations) * 0.5)
            glow_color = f"{color}{alpha:02x}"
            draw.text((position[0], position[1]), text, font=font, fill=glow_color)

    draw.text(position, text, font=font, fill=color)

def add_caption(frame, caption, global_settings, frame_time):
    pil_img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(pil_img)

    # Merge global settings with caption-specific style
    style = {**global_settings, **caption.get('style', {})}

    # Apply keyframe changes
    for keyframe in global_settings.get('keyframes', []):
        if keyframe['time'] <= frame_time:
            style.update(keyframe.get('globalChanges', {}))

    # Prepare font
    font_size = style.get('fontSize', 24)
    font_family = style.get('fontFamily', 'Arial').split(',')[0].strip()
    try:
        font = ImageFont.truetype(f"{font_family}.ttf", font_size)
    except IOError:
        font = ImageFont.load_default()

    # Calculate text position
    position = caption.get('position', global_settings.get('defaultPosition', {'x': 0.5, 'y': 0.9, 'anchor': 'bottom-center'}))
    text_width, text_height = draw.textsize(caption['text'], font=font)
    x = int(position['x'] * pil_img.width)
    y = int(position['y'] * pil_img.height)

    if position['anchor'] == 'center':
        x -= text_width // 2
        y -= text_height // 2
    elif position['anchor'] == 'bottom-center':
        x -= text_width // 2
        y -= text_height

    # Apply text effect
    apply_text_effect(draw, caption['text'], (x, y), font, style)

    # Apply highlight
    if 'highlight' in caption:
        words = caption['text'].split()
        highlight = caption['highlight']
        highlight_words = highlight.get('words', [])
        for i, word in enumerate(words):
            if word in highlight_words:
                word_width, word_height = draw.textsize(word, font=font)
                word_x = x + sum(draw.textsize(w, font=font)[0] for w in words[:i]) + i * font.getsize(' ')[0]
                word_y = y
                
                # Draw highlight background
                if highlight.get('backgroundColor'):
                    bg_color = highlight['backgroundColor']
                    corner_radius = highlight.get('cornerRadius', 0)
                    draw.rounded_rectangle([word_x, word_y, word_x + word_width, word_y + word_height], 
                                           fill=bg_color, radius=corner_radius)

                # Draw highlighted word
                apply_text_effect(draw, word, (word_x, word_y), font, {
                    'textColor': highlight.get('color', style['textColor']),
                    'textStrokeColor': highlight.get('strokeColor', style['textStrokeColor']),
                    'textStrokeWidth': highlight.get('strokeWidth', style['textStrokeWidth']),
                    'textEffect': style['textEffect'],
                    'effectIntensity': style['effectIntensity']
                })

    return cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

def generate_video(image_data, caption_data, output_file="output.mp4"):
    video_metadata = caption_data['videoMetadata']
    global_settings = caption_data['globalSettings']
    captions = caption_data['captions']
    
    video_dim = (video_metadata['resolution']['width'], video_metadata['resolution']['height'])
    fps = video_metadata['frameRate']
    duration = video_metadata['durationSeconds']

    temp_audio_files = []
    video_clips = []

    for item in image_data:
        img_path = item['path']
        print(f"Processing image: {img_path}")
        
        try:
            img = cv2.imread(img_path, cv2.IMREAD_COLOR)
            if img is None:
                raise ValueError(f"Image at {img_path} could not be loaded.")
            print(f"Image shape: {img.shape}")
        except Exception as e:
            print(f"Error loading image: {str(e)}")
            continue

        # Apply brightness and contrast effects
        brightness = float(item.get('effects', {}).get('brightness', 1.0))
        contrast = float(item.get('effects', {}).get('contrast', 1.0))
        img = apply_effects(img, brightness=brightness, contrast=contrast)

        # Apply animation effect
        animation_type = item.get('animation', 'none')
        start_time = float(item['start_time'].split(":")[-1])
        end_time = float(item['end_time'].split(":")[-1])
        duration = end_time - start_time
        
        if animation_type == 'zoom':
            frames = apply_zoom_effect(img, video_dim, fps, duration)
        elif animation_type == 'rotation':
            frames = apply_rotation_effect(img, video_dim, fps, duration)
        elif animation_type == 'blur':
            frames = apply_blur_effect(img, video_dim, fps, duration)
        elif animation_type == 'grayscale':
            frames = apply_grayscale_effect(img, video_dim, fps, duration)
        elif animation_type == 'color_tint':
            frames = apply_color_tint_effect(img, video_dim, fps, duration)
        else:
            frames = apply_ken_burns_effect(img, video_dim, fps, duration, (0.5, 0.5), (0.5, 0.5), 1.0, 1.0)

        # Generate audio for the subtitle if needed
        subtitle = item.get('subtitle', '')
        if subtitle:
            audio_file = text_to_speech_file(subtitle)
            temp_audio_files.append(audio_file)

        # Add captions to frames
        captioned_frames = []
        for i, frame in enumerate(frames):
            frame_time = start_time + (i / fps)
            for caption in captions:
                if caption['startTime'] <= frame_time < caption['endTime']:
                    frame = add_caption(frame, caption, global_settings, frame_time)
            captioned_frames.append(frame)

        # Create video clip from frames
        clip = ImageSequenceClip(captioned_frames, fps=fps)
        
        # Add audio if available
        if subtitle:
            audio_clip = AudioFileClip(audio_file)
            clip = clip.set_audio(audio_clip)
        
        video_clips.append(clip)

    # Concatenate all video clips
    final_video = concatenate_videoclips(video_clips)
    final_video.write_videofile(output_file, codec="libx264", fps=fps)

    # Clean up temporary files
    for temp_audio_file in temp_audio_files:
        os.remove(temp_audio_file)
    for video_clip in video_clips:
        video_clip.close()
    
    print(f"Video generated successfully: {output_file}")

if __name__ == "__main__":
    json_data = sys.stdin.read()
    print("Received JSON data:", json_data)

    data = json.loads(json_data)
    image_data = data['imageData']
    caption_data = data['captionData']
    
    generate_video(image_data, caption_data)