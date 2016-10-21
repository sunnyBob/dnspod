require.config({
	baseUrl:'./',
	paths:{
		'jquery': './lib/jquery.min',
		'view': './lib/view',
		'model': './lib/model',
		'mustache': './lib/mustache.min',
		'jquery-ui': './lib/jquery-ui/jquery-ui.min',
		'myModel': 'js/model',
		'myView': 'js/myView'
	}
})
requirejs(['js/app'])

