const useQueue = (Q, queue) => {
  const queueSubscribe = (event, callback) => {
    queue.subscribe(event, payload => {
      callback(payload);
    });
  };

  const queuePublish = (q, event, message) => {
    Q.publish(q, event, message);
  };

  return [queuePublish, queueSubscribe];
};

export default useQueue;
