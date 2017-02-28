'use strict';

const _ = require('lodash');
const path = require('path');
const BaseDB = require('./db-base');
const iterwait = require('./iterwait');
const { decompose, recombine } = require('./parsecfg');

class MasterDB extends BaseDB {

  constructor (filename, options) {
    super(filename, {
      create_file: _.get(options, 'create_file', true),
      single_conn: _.get(options, 'single_conn', true),
    });
  }

  static open (filename, options) {
    const db_opts = _.pick(options, ['create_file', 'single_conn']);
    const migrate = _.get(options, 'migrate', true);
    const migrate_opts = {
      force: _.get(options, 'force', false),
      migrationsPath: path.join(__dirname, '../migrations/master'),
    };

    let p = new Promise((resolve, reject) => {
      // Event handlers - each will remove the other when called
      let on_open, on_err;
      on_open = (file, base_db) => {
        base_db.removeListener('open:error', on_err);
        resolve(base_db);
      };
      on_err = (err, base_db) => {
        const fn = () => reject(err);
        base_db.removeListener('open:success', on_open);
        base_db.close().then(fn, fn);
      };

      // Create and register event handlers
      new MasterDB(filename, db_opts)
        .once('open:success', on_open)
        .once('open:error', on_err);
    });

    if (migrate) {
      p = p.then(master => master.db.migrate(migrate_opts).then(() => master));
    }

    return p;
  }

  /**
   *  Populates config, logtype caches
   */
  init () {

  }

  /**
   *  Refreshes config cache after fetching value(s)
   */
  getconfig () {

  }

  /**
   *  Refreshes config cache after setting value(s)
   */
  setconfig () {

  }

  /**
   *  Fetches user id, name, screen name, db path for display
   */
  user_info () {

  }

  /**
   *  Fetches user id, db_path, access token for launching
   */
  user_auth () {

  }

  /**
   *  Creates new user entry
   */
  new_user () {

  }

  /**
   *  Writes log entry to db/file/console as appropriate
   */
  log () {

  }

}

module.exports = MasterDB;