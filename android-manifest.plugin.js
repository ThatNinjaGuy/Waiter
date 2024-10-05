const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function androidManifestPlugin(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;

    // Add tools namespace if not present
    if (!androidManifest.$["xmlns:tools"]) {
      androidManifest.$["xmlns:tools"] = "http://schemas.android.com/tools";
    }

    // Find and modify the meta-data element
    const application = androidManifest.application;
    if (application && application[0] && application[0]["meta-data"]) {
      application[0]["meta-data"].forEach((metaData) => {
        if (
          metaData.$["android:name"] ===
          "com.google.firebase.messaging.default_notification_color"
        ) {
          metaData.$["tools:replace"] = "android:resource";
        }
      });
    }

    return config;
  });
};
