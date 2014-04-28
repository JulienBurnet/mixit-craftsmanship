define(['viewModels/talkVote', 'libs/timer', 'libs/voteSender'], function(talkVote, timer, voteSender) {
    describe('TalkVote ViewModels', function () {
        var oldTimerCreate = timer.create;
        var oldVoteSenderSend = voteSender.send;
        var oldVoteSenderEnable = voteSender.enable;
        var oldVoteSenderDisable = voteSender.disable;
        var oldVoteSenderIsEnabled = voteSender.isEnabled;
        after(function(){
            timer.create = oldTimerCreate;
            voteSender.send = oldVoteSenderSend;
            voteSender.enable = oldVoteSenderEnable;
            voteSender.disable = oldVoteSenderDisable;
            voteSender.isEnabled = oldVoteSenderIsEnabled;
        });

        var calledNb = 0;
        var restart = function() {
            calledNb++;
        };
        var timerCallback;
        var timerDelay;
        beforeEach(function(){
            calledNb = 0;
            timer.create = function(delay, callback){
                timerCallback = callback;
                timerDelay = delay;
                return {
                    restart: restart,
                    stop: function(){}
                };
            };

            voteSender.send = function() {};
            voteSender.isEnabled = function() { return true; };
            voteSender.enable = function() {};
            voteSender.disable = function() {};
        });

        it('When create Then template name should be talkVoteTemplate', function () {
            var vm = talkVote.create();

            vm.templateName.should.equal('talkVoteTemplate');
        });

        it('When create Then talkId and talkTitle are populate', function () {
            var vm = talkVote.create(5, 'hello');

            vm.talkId.should.equal(5);
            vm.talkTitle.should.equal('hello');
        });

        it('When create Then a timer is create with delay 500ms', function () {
            var vm = talkVote.create(5, 'hello');

            timerDelay.should.equal(500);
        });

        it('When create Then a timer is stopped', function () {
            var vm = talkVote.create(5, 'hello');

            calledNb.should.equal(0);
        });

        it('When vote Then a timer is started', function () {
            var vm = talkVote.create(5, 'hello');

            vm.vote();

            calledNb.should.equal(1);
        });

        it('Given several click When vote Then a timer is not restart', function () {
            var vm = talkVote.create(5, 'hello');

            vm.vote();
            vm.vote();

            calledNb.should.equal(1);
        });

        it('When create Then happyLevel is 0', function () {
            var vm = talkVote.create(5, 'hello');

            vm.happyLevel().should.equal(0);
        });

        it('When vote Then happyLevel is 1', function () {
            var vm = talkVote.create(5, 'hello');

            vm.vote();

            vm.happyLevel().should.equal(1);
        });

        it('When 2 votes Then happyLevel is 1 before interval end', function () {
            var vm = talkVote.create(5, 'hello');

            vm.vote();
            vm.vote();

            vm.happyLevel().should.equal(1);
        });

        var votesAndCallTimerCallback = function(vm, votesNb){
            for(var i = 0; i < votesNb; i++){
                vm.vote();
            }
            timerCallback();
        };

        it('When 2 votes Then happyLevel is 1 after interval end', function () {
            var vm = talkVote.create(5, 'hello');

            votesAndCallTimerCallback(vm, 2);

            vm.happyLevel().should.equal(2);
        });

        it('When 3 votes Then happyLevel is 2', function () {
            var vm = talkVote.create(5, 'hello');

            votesAndCallTimerCallback(vm, 3);

            vm.happyLevel().should.equal(2);
        });

        it('When 4 votes Then happyLevel is 2', function () {
            var vm = talkVote.create(5, 'hello');

            votesAndCallTimerCallback(vm, 4);

            vm.happyLevel().should.equal(2);
        });

        it('When 5 votes Then happyLevel is 3', function () {
            var vm = talkVote.create(5, 'hello');

            votesAndCallTimerCallback(vm, 5);

            vm.happyLevel().should.equal(3);
        });

        it('When 6 votes Then happyLevel is 3', function () {
            var vm = talkVote.create(5, 'hello');

            votesAndCallTimerCallback(vm, 6);

            vm.happyLevel().should.equal(3);
        });

        it('When 7 votes Then happyLevel is 4', function () {
            var vm = talkVote.create(5, 'hello');

            votesAndCallTimerCallback(vm, 7);

            vm.happyLevel().should.equal(4);
        });

        it('When 8 votes Then happyLevel is 4', function () {
            var vm = talkVote.create(5, 'hello');

            votesAndCallTimerCallback(vm, 8);

            vm.happyLevel().should.equal(4);
        });

        it('When 9 votes Then happyLevel is 5', function () {
            var vm = talkVote.create(5, 'hello');

            votesAndCallTimerCallback(vm, 9);

            vm.happyLevel().should.equal(5);
        });

        it('When votes Then happyLevel cannot more than 5', function () {
            var vm = talkVote.create(5, 'hello');

            votesAndCallTimerCallback(vm, 20);

            vm.happyLevel().should.equal(5);
        });

        it('When timer end Then votes nb is divide by 2', function () {
            var vm = talkVote.create(5, 'hello');

            votesAndCallTimerCallback(vm, 10);

            timerCallback();
            vm.happyLevel().should.equal(3);

            timerCallback();
            vm.happyLevel().should.equal(2);

            timerCallback();
            vm.happyLevel().should.equal(1);
        });

        it('When timer end Then floor votes nb', function () {
            var vm = talkVote.create(5, 'hello');

            votesAndCallTimerCallback(vm, 3);

            timerCallback();
            vm.happyLevel().should.equal(1);
        });

        it('When create Then enable voteSender', function () {
            var called = false;
            voteSender.enable = function() {
                called = true;
            };

            var vm = talkVote.create(5, 'hello');

            called.should.be.true;
        });

        it('When vote Then send vote', function () {
            var talkIdSended;
            voteSender.send = function(talkId) {
                talkIdSended = talkId;
            };

            var vm = talkVote.create(5, 'hello');

            vm.vote();

            talkIdSended.should.equal(5);
        });

        it('When votes Then send vote each votes', function () {
            var calledNb = 0;
            voteSender.send = function() {
                calledNb++;
            };

            var vm = talkVote.create(5, 'hello');

            vm.vote();
            vm.vote();

            calledNb.should.equal(2);
        });

        it('Given voteSender not connected When vote Then hasError is true and not vote', function () {
            var called = false;
            voteSender.send = function() {
                called = true;
            };
            voteSender.isEnabled = function() { return false; };

            var vm = talkVote.create(5, 'hello');

            vm.vote();

            vm.hasError().should.be.true;
            called.should.be.false;
            vm.happyLevel().should.equal(0);
        });

        it('Given voteSender connected When vote Then hasError is false', function () {
            var vm = talkVote.create(5, 'hello');

            vm.vote();

            vm.hasError().should.be.false;
        });

        it('When create Then hasError is false', function () {
            var vm = talkVote.create(5, 'hello');

            vm.hasError().should.be.false;
        });

        it('When dispose Then stop timer', function () {
            var called = false;
            timer.create = function(){
                return {
                    restart: function(){},
                    stop: function(){
                        called = true;
                    }
                };
            };
            var vm = talkVote.create(5, 'hello');

            vm.dispose();

            called.should.be.true;
        });

        it('When dispose Then disable voteSender', function () {
            var called = false;
            voteSender.disable = function(){
                called = true;
            };
            var vm = talkVote.create(5, 'hello');

            vm.dispose();

            called.should.be.true;
        });
    });
});