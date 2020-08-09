import { Component, OnInit, ViewChild } from "@angular/core";
import Peer from "peerjs";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "facie";

  @ViewChild("myvideo", { static: true }) myVideo: any;
  peer;
  anotherid;
  mypeerid;
  msg = undefined;
  mymsg;
  ngOnInit() {
    let video = this.myVideo.nativeElement;

    var n = <any>navigator;
    n.getUserMedia =
      n.getUserMedia ||
      n.webkitGetUserMedia ||
      n.mozGetUserMedia ||
      n.msGetUserMedia;

    this.peer = new Peer({
      host: "my-peer-webrtc.herokuapp.com",
      path: "/peerjs/myapp",
      port: 80,
    });
    setTimeout(() => {
      this.mypeerid = this.peer.id;
    }, 3000);

    this.peer.on("connection", function (conn) {
      conn.on("data", function (data) {
        let x = data;
        this.msg = x;
        console.log(this.msg);
      });
    });

    this.peer.on("call", function (call) {
      n.mediaDevices.getUserMedia(
        { video: true, audio: true },
        function (stream) {
          call.answer(stream);
          call.on("stream", function (remotestream) {
            video.src = URL.createObjectURL(remotestream);
            video.play();
          });
        },
        function (err) {
          console.log("Failed to get stream", err);
        }
      );
    });
  }
  send() {
    var x = this.mymsg;
    var conn = this.peer.connect(this.anotherid);
    conn.on("open", function () {
      conn.send(x);
    });
  }
  videoconnect() {
    let video = this.myVideo.nativeElement;
    var localvar = this.peer;
    var fname = this.anotherid;

    var n = <any>navigator;

    n.getUserMedia =
      n.getUserMedia ||
      n.webkitGetUserMedia ||
      n.mozGetUserMedia ||
      n.msGetUserMedia;

    n.mediaDevices.getUserMedia(
      { video: true, audio: true },
      function (stream) {
        var call = localvar.call(fname, stream);
        call.on("stream", function (remotestream) {
          video.src = URL.createObjectURL(remotestream);
          video.play();
        });
      },
      function (err) {
        console.log("Failed to get stream", err);
      }
    );
  }
}
