let io;

function setIo(socketIoInstance) {
  io = socketIoInstance;
}

function getIo() {
  return io;
}

module.exports = { setIo, getIo };