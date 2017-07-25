/*
Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    config.language = 'zh-cn';
    //config.uiColor = '#AADC6E';
    config.filebrowserUploadUrl = 'probSave.ashx?type=file&isImage=true'; //上传文件按钮(标签)
    config.removePlugins = 'elementspath';
    config.resize_enabled = false;
    config.toolbar = 'MyToolbar';
    config.skin = 'moonocolor';
    config.toolbar_MyToolbar =
	[
            { name: 'document', items: ['NewPage', 'DocProps', 'Preview', 'Print'] },
	        { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo'] },
	        { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll'] },
	        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
	        {
	            name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent',
                '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']
	        }, { name: 'tools', items: ['Maximize'] }, '/',
	        { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
	        { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
	        { name: 'colors', items: ['TextColor', 'BGColor'] }

	];
};
