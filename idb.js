var openConnRequest = window.indexedDB.open('test_' + Date.now(), 1);

openConnRequest.addEventListener('error', function (evt) {
    console.log('error', evt.target.error);
}, false);

openConnRequest.addEventListener('upgradeneeded', function (evt) {
    console.log('upgradeneeded', evt.oldVersion, evt.newVersion, this.result);

    var database = this.result;
    var objStore = database.createObjectStore('users', {keyPath: 'login'});
    objStore.createIndex('login_search', 'login', {unique: true});
}, false);

openConnRequest.addEventListener('success', function (evt) {
    console.log('success', this.result);

    var db = this.result;
    insertTenUsers(db, function () {
        insertTenUsers(db, function () {
            
        });
    });
}, false);

openConnRequest.addEventListener('blocked', function (evt) {
    console.log('blocked', evt);
}, false);

function insertTenUsers(db, callback) {
    console.log('Insert 10 users into the database');
    var transaction = db.transaction(['users'], 'readwrite');

    transaction.oncomplete = function (evt) {
        console.log('transaction completed', evt);
        callback();
    };

    transaction.onabort = function (evt) {
        console.log('transaction aborted', evt);
        callback();
    };

    transaction.onerror = function (evt) {
        console.log('transaction error', evt);
    };

    var objStore = transaction.objectStore('users');
    var loginPrefix = 'kp_';

    // insert 10 records
    for (var i = 0; i < 10; i++) {
        objStore.add({login: loginPrefix + i});
    }
}