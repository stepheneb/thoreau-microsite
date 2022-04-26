#!/bin/sh

# Example
#
# Convert winter-stream-960x540.mp4 with 2-pass constant quality
# and 2-pass at average bitrates of @M and 1M.
#
# $ cd src/media/video/winter-stream
# $ ../../../bin/mp4-to-webm.sh winter-stream-960x540.mp4
# $ ../../../bin/mp4-to-webm.sh winter-stream-960x540.mp4 1M
# $ ../../../bin/mp4-to-webm.sh winter-stream-960x540.mp4 1M
#
# $ ls -lh winter-stream-960x540.*
# -rw-r--r--@ 1 stephen  staff    24M Oct 28 16:45 winter-stream-960x540.mp4
# -rw-r--r--  1 stephen  staff   4.5M Nov 26 14:43 winter-stream-960x540.mp4-1M.webm
# -rw-r--r--  1 stephen  staff   8.8M Nov 26 14:48 winter-stream-960x540.mp4-2M.webm
# -rw-r--r--  1 stephen  staff    21M Nov 26 14:40 winter-stream-960x540.mp4.webm

if [ $# -eq 0 ]; then
    echo "No input mp4 file provided"
    exit 1
fi

MP4=$1
NAME=${1%.*}

BITRATE=""
if [ $# -eq 2 ]; then
  BITRATE=$2
  BITRATE_DESC=", average bitrate conversion to $BITRATE"
  BITRATE_FLAG=true
  WEBM_OUTPUT="$NAME-$BITRATE.webm"
else
  BITRATE="0"
  BITRATE_DESC=""
  WEBM_OUTPUT="$NAME.webm"
fi

if [ $# -eq 3 ]; then
  AUDIO="-c:a libopus"
else
  AUDIO="-an"
fi

SPEEDUP="-threads 8 -speed 4 -row-mt 1"

# Constant quality 2-pass is invoked by setting -b:v to zero and
# For two-pass targeting an average bitrate, the target bitrate is
# specified with the -b:v switch:
#
# see:
# - https://trac.ffmpeg.org/wiki/Encode/VP9
# - https://trac.ffmpeg.org/wiki/Encode/H.264

# ffmpeg -i $MP4 -c:v libvpx-vp9 -b:v $BITRATE -crf 30  -pass 1  -an -f null /dev/null && \
# ffmpeg -i $MP4 -c:v libvpx-vp9 -b:v $BITRATE -crf 30  -pass 2 -c:a libopus -y $WEBM

# -threads 8 -speed 4 -row-mt 1

CMD="ffmpeg -i $MP4 -c:v libvpx-vp9 -b:v $BITRATE -crf 30 -pass 1 -an -f null /dev/null &&
ffmpeg -i $MP4 -c:v libvpx-vp9 -b:v $BITRATE -crf 30 -pass 2 $AUDIO $SPEEDUP -y $WEBM_OUTPUT"


echo ""
echo "Command: 2-pass MP4 to WEBM$BITRATE_DESC"
echo $CMD
echo ""

eval "$CMD"

# if [ "$BITRATE_FLAG" = "true" ]; then
#   MP4_OUTPUT="$NAME-$BITRATE.mp4"
#   MP4_CMD="ffmpeg -i $MP4 -c:v libx264 -b:v $BITRATE -pass 1 -an -f null /dev/null &&
#   ffmpeg -i $MP4 -c:v libx264 -b:v $BITRATE -pass 2 -c:a aac -b:a 128k $SPEEDUP -y $MP4_OUTPUT"
#   echo ""
#   echo "Command: 2-pass MP4$BITRATE_DESC"
#   echo $MP4_CMD
#   echo ""
#   eval "$MP4_CMD"
# fi

rm -f -- ffmpeg2pass*.log*
