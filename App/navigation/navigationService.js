import {NavigationActions} from '@react-navigation/native';

let _navigator;

function setTopLevelNavigator(navigatorRef){
	_navigator = navigatorRef;
}

function navigate(routeName, params) {
	_navigator.navigate(routeName,params);
}

function goBack() {
	_navigator.dispatch(NavigationActions.back());
}
function getCurrentRoute() {
	if (!_navigator || !_navigator.getCurrentRoute) {
	  return null;
	}
  
	return _navigator.getCurrentRoute();
  }

export default {
	navigate,
	setTopLevelNavigator,
	goBack,
	getCurrentRoute
};

