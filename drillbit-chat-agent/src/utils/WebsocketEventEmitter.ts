import { EventEmitter } from "events";

class WebSocketEventEmitter extends EventEmitter {
  private ws: WebSocket | null = null;

  connect(url: string) {
    if (this.ws) {
      return;
    }

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.emit("open");
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.emit(message.eventType, message.data);
    };

    this.ws.onerror = (error) => {
      this.emit("error", error);
    };

    this.ws.onclose = () => {
      this.emit("close");
      this.ws = null;
    };
  }

  sendMessage(eventType: string, data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ eventType, data }));
    } else {
      console.warn("WebSocket is not open. Cannot send message.");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const websocketEmitter = new WebSocketEventEmitter();
