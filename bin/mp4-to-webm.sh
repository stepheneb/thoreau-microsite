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

BITRATE="2M"
if [ $# -eq 2 ]
then
  BITRATE=$2
  WEBM="$1-$BITRATE.webm"
else
  BITRATE="0"
  WEBM="$1.webm"
fi

SPEEDUP="-threads 8 -speed 4 -row-mt 1"

# Constant quality 2-pass is invoked by setting -b:v to zero and
# For two-pass targeting an average bitrate, the target bitrate is
# specified with the -b:v switch:
#
# see: https://trac.ffmpeg.org/wiki/Encode/VP9

# ffmpeg -i $MP4 -c:v libvpx-vp9 -b:v $BITRATE -crf 30  -pass 1  -an -f null /dev/null && \
# ffmpeg -i $MP4 -c:v libvpx-vp9 -b:v $BITRATE -crf 30  -pass 2 -c:a libopus -y $WEBM

# -threads 8 -speed 4 -row-mt 1

CMD="ffmpeg -i $MP4 -c:v libvpx-vp9 -b:v $BITRATE -crf 30  -pass 1  -an -f null /dev/null &&
ffmpeg -i $MP4 -c:v libvpx-vp9 -b:v $BITRATE -crf 30  -pass 2 -c:a libopus $SPEEDUP -y $WEBM"

echo ""
echo $CMD
echo ""

eval "$CMD"

if [ -f ffmpeg2pass*.log ]; then
  rm -f ffmpeg2pass*.log
fi
