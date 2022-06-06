import { useState } from "react";
import webstomp from "webstomp-client";

const App = () => {
  // URL´s
  const STOMP_URL = "wss://iot1.ischdesign.com:9097/socket-connect";
  const STOMP_TOPIC = "/topic/message";

  // Stomp client config.
  const stompInitialState = webstomp.client(STOMP_URL, { debug: false });

  // Initializing a stomp client instance.
  const [stompClient, setStompClient] = useState(stompInitialState);
  const [stompSubscription, setStompSubscription] = useState(false);

  // UI states.
  const [isStompConnected, setIsStompConnected] = useState(false);
  const [isStompSubscribed, setIsStompSubscribed] = useState(false);

  // Handling incoming messages.
  const handler = (message) => console.log(message);

  // Handling connection/disconnection.
  const connect = () => {
    if (!isStompConnected) {
      stompClient.connect({}, (data) => console.log(data));
      stompClient.onreceive = handler;
      setIsStompConnected(true);
    } else {
      stompClient.disconnect();
      setStompClient(stompInitialState);
      setIsStompConnected(false);
    }
  };

  // Handling subscripction/unsubscriptions.
  const subscribe = () => {
    if (!isStompSubscribed) {
      setStompSubscription(stompClient.subscribe(STOMP_TOPIC));
      setIsStompSubscribed(true);
    } else {
      setStompSubscription(stompSubscription.unsubscribe());
      setIsStompSubscribed(false);
    }
  };

  return (
    <main>
      <h1>
        WebSocket <i>STOMP</i> Client
      </h1>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ border: "1px solid", textAlign: "center", padding: 10 }}>
          <p>
            Status:
            {isStompConnected ? (
              <span style={{ color: "green" }}>Connected</span>
            ) : (
              <span style={{ color: "red" }}>Disconnected</span>
            )}
          </p>
          <button
            onClick={connect}
            style={isStompConnected ? { color: "red" } : { color: "green" }}>
            {isStompConnected ? "Disconnect" : "Connect"}
          </button>
        </div>
        {isStompConnected && (
          <div
            style={{ border: "1px solid", textAlign: "center", padding: 10 }}>
            <p>
              Subscription:
              {isStompSubscribed ? (
                <span style={{ color: "green" }}>Subscribed</span>
              ) : (
                <span style={{ color: "red" }}>Unsubscribed</span>
              )}
            </p>
            <button
              onClick={subscribe}
              style={isStompSubscribed ? { color: "red" } : { color: "green" }}>
              {isStompSubscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default App;
