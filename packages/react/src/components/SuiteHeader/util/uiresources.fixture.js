const fixture = {
  '/uiresources': {
    username: 'adminuser',
    userDisplayName: 'Test Admin',
    routes: {
      profile: 'https://home.my-domain/myaccount',
      navigator: 'https://mockedworkspace.home.my-domain',
      admin: 'https://admin.my-domain',
      logout: 'https://home.my-domain/logout',
      logoutInactivity: 'https://home.my-domain/logout/inactivity',
      whatsNew: 'https://www.ibm.com',
      gettingStarted: 'https://www.ibm.com',
      documentation: 'https://www.ibm.com',
      requestEnhancement: 'https://www.ibm.com',
      support: 'https://www.ibm.com',
      about: 'https://home.my-domain/about',
      workspaceId: 'mockedworkspace',
      domain: 'my-domain',
    },
    applications: [
      {
        id: 'manage',
        name: 'Manage',
        href: 'https://mockedworkspace.manage.mydomain.com/',
        isExternal: false,
      },
      {
        id: 'Health',
        name: 'Manage',
        href: 'https://mockedworkspace.health.mydomain.com/',
        isExternal: false,
      },
    ],
    i18n: {
      help: 'Help',
      profileTitle: 'Profile',
      profileManageButton: 'Manage profile',
      profileLogoutButton: 'Log out',
      logout: 'Logout',
      userIcon: 'User',
      administrationIcon: 'Administration',
      settingsIcon: 'Settings',
      profileLogoutModalHeading: 'Do you wish to log out?',
      profileLogoutModalSecondaryButton: 'Cancel',
      profileLogoutModalPrimaryButton: 'Log out',
      profileLogoutModalBody:
        'You are logged in to {solutionName} as {userName}.  Logging out also logs you out of each application that is open in the same browser.  To ensure a secure log out, close all open browser windows.',
      switcherWorkspace: 'Workspace',
      switcherWorkspaces: 'Workspaces',
      switcherWorkspaceAdmin: 'Workspace administration',
      switcherBackToAppSwitcher: 'Back to applications',
      switcherSelectWorkspace: 'Select a workspace',
      switcherAvailableWorkspaces: 'Available workspaces',
      switcherSuiteAdmin: 'Suite administration',
      switcherGlobal: 'Global / other',
      switcherMyApplications: 'My applications',
      switcherNavigatorLink: 'All applications',
      switcherLearnMoreLink: 'Learn more',
      switcherRequestAccess: 'Contact your administrator to request application access',
      whatsNew: "What's new",
      documentation: 'Documentation',
      requestEnhancement: 'Request enhancement',
      about: 'About',
      support: 'Support',
      gettingStarted: 'Getting started',
      surveyTitle: 'Enjoying {solutionName}?',
      surveyText: 'Click here to help us improve the product',
      surveyPrivacyPolicy: 'IBM Privacy Policy',
      sessionTimeoutModalHeading: 'Session Timeout',
      sessionTimeoutModalBody: 'You will be logged out due to inactivity in {countdown} seconds.',
      sessionTimeoutModalLogoutButton: 'Log out',
      sessionTimeoutModalStayLoggedInButton: 'Stay logged in',
    },
    surveyData: {
      surveyLink: 'https://www.ibm.com',
      privacyLink: 'http://www.ibm.com/en/privacy',
    },
    idleTimeoutData: {
      timeout: 60,
      countdown: 20,
      cookieName: '_user_inactivity_timeout',
    },
  },
};

export default fixture;
