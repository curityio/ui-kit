
# Curity UI Icons React

Library to use selected Curity UI icons in public React based projects.


## Install this package in an external project

It is possible to install the package outside of this repository, using GitHub Packages.

```shell
npm install @curityio/ui-kit/icons
```

[Read more](https://github.com/curityio/UI-Kit/pkgs/npm/ui-kit)


## Use icons

Import icons like this

```js
import { IconGeneralClose } from '@curity/ui-kit-icons';
```

Use an icon like this

```js
<IconGeneralClose />
```

You can also pass props like this

```js
<IconGeneralClose color="white" width="48" height="48"/>
```

## Available Icons

### Action
- `IconActionAutoLinkAccount`
- `IconActionMultiFactor`

### Authenticator
- `IconAuthenticatorDefault`
- `IconAuthenticatorGoogle`
- `IconAuthenticatorPasskeys`
- `IconAuthenticatorTotp`

### Capability
- `IconCapabilityResourceOwnerPasswordCredentials`

### Facilities
- `IconFacilitiesEmail`
- `IconFacilitiesSms`

### General
- `IconGeneralArrowBack`
- `IconGeneralArrowForward`
- `IconGeneralCheckmarkCircled`
- `IconGeneralChevron`
- `IconGeneralClose`
- `IconGeneralDownload`
- `IconGeneralEdit`
- `IconGeneralEmptyStateIcon`
- `IconGeneralEyeHide`
- `IconGeneralKebabMenu`
- `IconGeneralLocation`
- `IconGeneralLock`
- `IconGeneralLockUnlocked`
- `IconGeneralPlane`
- `IconGeneralPlus`
- `IconGeneralTrash`
- `IconGeneralWarning`

### Key
- `IconKey`

### Token
- `IconToken`

### User
- `IconUser`
- `IconUserDataSources`
- `IconUserManagement`

### VCI
- `IconVciCredentialHome`

## Development

### Build the icon library

```shell
npm run build
```
