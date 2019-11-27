import { resolve } from 'path';
import { existsSync } from 'fs';

import { i18n } from '@kbn/i18n';

import exampleRoute from './server/routes/example';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'kibana_nori_manager',
    uiExports: {
      app: {
        title: 'Korean (nori) Plugin',
        description: 'Nori korean analyzer management UI Kibana plugin',
        main: 'plugins/kibana_nori_manager/app',
        icon: 'plugins/kibana_nori_manager/img/kr.svg'
      },
      styleSheetPaths: [resolve(__dirname, 'public/app.scss'), resolve(__dirname, 'public/app.css')].find(p => existsSync(p)),
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init(server, options) { // eslint-disable-line no-unused-vars
      const xpackMainPlugin = server.plugins.xpack_main;
      if (xpackMainPlugin) {
        const featureId = 'kibana_nori_manager';

        xpackMainPlugin.registerFeature({
          id: featureId,
          name: i18n.translate('kibanaNoriManager.featureRegistry.featureName', {
            defaultMessage: 'kibana-nori-manager',
          }),
          navLinkId: featureId,
          icon: 'canvasApp',
          app: [featureId, 'kibana'],
          catalogue: [],
          privileges: {
            all: {
              api: [],
              savedObject: {
                all: [],
                read: [],
              },
              ui: ['show'],
            },
            read: {
              api: [],
              savedObject: {
                all: [],
                read: [],
              },
              ui: ['show'],
            },
          },
        });
      }

      // Add server routes and initialize the plugin here
      exampleRoute(server);
    }
  });
}
