describe('Insert operations', function () {
    var dbName = 'dbName' + Math.random();
    var conn;

    function openConnection(done) {
        openBaseConnection(dbName).then(function (connection) {
            conn = connection;
            done();
        }).catch(function () {
            done.fail('Open connection op failed');
        });
    }

    function closeConnection(cb) {
        if (conn) {
            conn.close();
            conn = null;

            cb();
        }
    }

    describe('Errors tests', function () {
        beforeEach(openConnection);

        it('should produce Error with NotFoundError name field when wrong object stores are used', function (done) {
            conn.insert({
                'missing_object_store': ['some', 'data']
            }).then(function () {
                done.fail('Insert returns resolved promise');
            }).catch(function (err) {
                expect(err instanceof Error).toBe(true);
                expect(err.name).toBe('NotFoundError');
                done();
            });
        });

        it('should produce Error with InvalidStateError name field when wrong data is passed', function (done) {
            conn.insert('keypath_true__keygen_false_2', 'string data').then(function () {
                done.fail('Insert returns resolved promise');
            }).catch(function (err) {
                console.log(err.stack)
                expect(err instanceof Error).toBe(true);
                expect(err.name).toEqual('InvalidStateError');
                done();
            });
        });

        it('should produce Error with ConstraintError name field when same unique keys are passed', function (done) {
            conn.insert({
                'keypath_true__keygen_false_0': [
                    {login: 'Alex'},
                    {login: 'Alex2'},
                    {login: 'Alex3'},
                    {login: 'Alex4'},
                    {login: 'Alex2'},
                ]
            }).then(function () {
                done.fail('Insert returns resolved promise');
            }).catch(function (err) {
                expect(err instanceof Error).toBe(true);
                expect(err.name).toBe('ConstraintError');
                done();
            });
        });

        afterEach(closeConnection);
    });

    runCommonAddTests('insert');
});
