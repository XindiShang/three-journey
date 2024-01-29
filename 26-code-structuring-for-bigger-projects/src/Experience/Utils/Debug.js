import * as dat from 'lil-gui'

export default class Debug {
  constructor() {
    this.active = window.location.hash === '#debug'
    // a window.location object usually has:
    //   {
    //     "ancestorOrigins": {},
    //     "href": "http://192.168.0.100:8080/#debug",
    //     "origin": "http://192.168.0.100:8080",
    //     "protocol": "http:",
    //     "host": "192.168.0.100:8080",
    //     "hostname": "192.168.0.100",
    //     "port": "8080",
    //     "pathname": "/",
    //     "search": "",
    //     "hash": "#debug"
    // }

    if (this.active) {
      this.initGUI();
    }
  }

  initGUI() {
    this.gui = new dat.GUI();
  }
}