define(function (require) {
	var Tip = function (Msg) {
        this.Msg =Msg
        $("div.header").html(this.Msg)
        $("div.testTip").slideDown();
        this.hidden = function () {
            $("div.testTip").slideUp();
        }
        setTimeout(this.hidden, 3000)
    }
    return Tip
})