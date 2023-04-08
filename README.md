# Meta's Segment Anything Model (SAM) Demo Site

## About

<!--Image / Video annotation based on Meta's Segment Anything Model (SAM). \-->
This repository is based on their demo website,
[segment-anything.com](https://segment-anything.com).

## Usage

To use this repository, clone it and install the required packages
by doing:

```bash
git clone https://github.com/MiscellaneousStuff/meta-sam-demo
cd meta-sam-demo
npm i
```

Then run it like a regular react app:

```bash
npm run start
```

To actually use the site when it is deployed, navigate to:
`http://localhost:3000/`. By default, the site re-directs to the
demo page, however, all of the original pages are included and you
can uncomment out whatever you want to run.

<!--
## Overview

The demo website uses two quantized models
- Prompt Encoder: `interactive_module_quantized_592547_2023_03_19_sam6_long_uncertain.onnx`
- Mask Decoder: `interactive_module_quantized_592547_2023_03_20_sam6_long_all_masks_extra_data_with_ious.onnx`
-->

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).