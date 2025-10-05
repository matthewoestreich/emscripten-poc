rm -rf build
mkdir build
emcc core.cpp \
  -g2 \
  -O2 \
  -pthread \
  -s USE_PTHREADS=1 \
  -s PTHREAD_POOL_SIZE=2 \
  -s MODULARIZE=1 \
  -s 'EXPORT_NAME="emscriptenPOC"' \
  -o build/emscripten-poc-built.js