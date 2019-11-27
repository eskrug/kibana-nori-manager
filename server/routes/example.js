export default function (server) {

  server.route({
    path: '/api/kibana-nori-manager/example',
    method: 'GET',
    handler() {
      return { time: (new Date()).toISOString() };
    }
  });

}
