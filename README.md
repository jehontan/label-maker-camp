# Wristband Label Maker PWA

This simple PWA generates wristband labels with QR code to support operations at COVID-19 [Community Care Facilities (CCFs)](https://www.straitstimes.com/singapore/coronavirus-community-care-facilities-for-patients-with-mild-symptoms-will-have-bed) in Singapore.

You can check out the live app [here](https://jehontan.github.io/label-maker).

## Problem

Medical wristbands are used for tagging persons housed in CCFs, however given the immediacy of the CCF operations and the ongoign supply chain challenges label printers and wristband labels used are from a variety of different vendors, each using their own label creation software, templates, drivers and SDKs. A solution was needed to simplify and commonalize the method of label generation and printing.

## Solution

All the printers used provide a Windows print driver. Generating an image of the label, then using the system print dialog to print was the way to go. 

Computers used at the CCFs come from a variety of sources, and some may have additional security features that make installation of software difficult. A web app solution allows  distribution methods (internet, zipped static files) that are supported by the different computers, and can also be used on mobile devices if supported by the printer (e.g. via AirPrint, Google Cloud Print).

A simple and intuitive GUI was developed to enable operators to generate and print labels with no training. Print settings can be adjusted for different printers, and the suitable settings for specific printers are pre-populated.

This PWA is also [installable](https://support.google.com/chrome/answer/9658361) on a variety of platforms using Google Chrome. The "native" appearance of the app makes it easier to launch and interact with for uninitiated operators.

All processing is done offline to protect personal data; web deployment is used only to simplify distribution.

## Acknowledgements

Development was greatly simplified by the use of [Create-React-App](https://github.com/facebook/create-react-app) and [Material UI](https://material-ui.com/).

This app uses [qrcode-generator](https://www.npmjs.com/package/qrcode-generator) to generate QR codes.