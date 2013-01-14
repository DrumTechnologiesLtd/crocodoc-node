var API = module.exports = {
  DocumentAPI:  require('./api/document'),
  DownloadAPI:  require('./api/download'),
  SessionAPI:   require('./api/session'),
  CrocodocAPI:  function(apiToken) {
    return {
      documentAPI:  new API.DocumentAPI(apiToken),
      downloadAPI:  new API.DownloadAPI(apiToken),
      sessionAPI:   new API.SessionAPI(apiToken)
    };
  }
};
