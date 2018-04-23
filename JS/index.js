/// <reference path="C:/Program Files (x86)/DevExpress 16.1/DevExtreme/Sources/Lib/ts/jquery.d.ts" />
/// <reference path="C:/Program Files (x86)/DevExpress 16.1/DevExtreme/Sources/Lib/ts/dx.all.d.ts" />

$(function () {

    function PreviewMedia(elType, file) {
        var type = file.type
        var mediaNode = $("#" + elType);
        var canPlay = mediaNode.get(0).canPlayType(type)
        if (canPlay === '') {
            DevExpress.ui.notify("Selected media type is not supported");
            return;
        }
        var fileURL = URL.createObjectURL(file);
        mediaNode.show();
        mediaNode.attr({ "type": type, "src": fileURL });
    }
    function PreviewImages(file) {

        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                // Render thumbnail.
                var span = $('<span>');
                span.html(['<img class="thumb" src="', e.target.result,
                    '" title="', escape(theFile.name), '"/>'].join(''))
                $('#list').append(span);
            };
        })(file);

        reader.readAsDataURL(file);
    }
    $("#container").dxBox({
        direction: "row",
        width: "100%",
        height: 375
    });
    $("#accept-option").dxSelectBox({
        dataSource: [
            { name: "Images", value: "image/*" },
            { name: "Videos", value: "video/*" },
            { name: "Audio", value: "audio/*" },
        ],
        valueExpr: "value",
        displayExpr: "name",
        value: "image/*",
        width: 200,
        onValueChanged: function (e) {
            fileUploader.option({ accept: e.value, multiple: e.value === "image/*" });
            fileUploader.reset();
        }
    });
    var fileUploader = $("#fileUploader").dxFileUploader({
        selectButtonText: "Select file(s)",
        accept: "image/*",
        uploadMode: "useButtons",
        multiple: true,
        onValueChanged: function (args) {
            var files = args.value;
            $('#list').html('');
            $("#myMedia").hide();
            if (files.length == 0)
                return;
            if (args.component.option("accept") === "image/*") {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    PreviewImages(file);
                }
            } else {
                PreviewMedia("myMedia", args.value[0]);
            }
        }

    }).dxFileUploader("instance");
});