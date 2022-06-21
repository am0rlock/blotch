import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
	html {
		font-size: 16px;
		box-sizing: border-box;
		height: 100%;
		background-color: rgb(24, 24, 25);
	}

	*, *:before, *:after {
		padding: 0;
		margin: 0;
		box-sizing: inherit;
	}

	body {
		font-family: 'Fira Sans', sans-serif;
		font-size: 1rem;
		line-height: 1.7;
		background: ${(props) => props.theme.bg};
		color: ${(props) => props.theme.primaryColor};
		overflow-x: hidden;
		background-color: rgb(24, 24, 25);
	}

	h1, h2, h3, h4, h5, h6 {
		font-weight: normal;
	}

	a {
		text-decoration: none;
		cursor: pointer;
		color: inherit;
	}

	.pointer {
		cursor: pointer;
	}

	.secondary {
		color: ${(props) => props.theme.secondaryColor};
	}

	.danger {
		color: ${(props) => props.theme.red};
	}

	button, svg {
	  cursor: pointer;
	}

	.bold {
		font-weight: 800;
	}

	*:focus {
	  outline: none;
	}

	#container {
		position: relative;
		background-color: rgb(24, 24, 25);
	}

	.bottomNavigationContainer {
		position: fixed;
		bottom: 0;
		width: 100%;
	}

	bottomNavigationDiv {
		border: 2px solid green;
	}

	.MuiBottomNavigation-root {
		background-color: rgba(99, 99, 102, .5);
	}
`;

export default GlobalStyle;
