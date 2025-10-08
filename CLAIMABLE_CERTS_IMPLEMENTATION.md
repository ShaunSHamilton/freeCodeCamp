# Claimable Certifications Notification Feature

## Overview
This feature displays a dismissible flash message to logged-in users when they navigate to the landing page (`/`) or curriculum page (`/learn`), notifying them if they have any certifications available to claim.

## Implementation Details

### 1. Redux Selector (`client/src/redux/selectors.js`)
Added `claimableCertsSelector` that:
- Checks if user is logged in
- Verifies user has a name and has agreed to Academic Honesty Policy (`isHonest`)
- Iterates through all certifications to check:
  - If the certification is already claimed
  - If all required projects for that certification are completed
- Returns an array of claimable certifications with their name and slug

### 2. Flash Message System
**Enum** (`client/src/components/Flash/redux/flash-messages.ts`):
- Added `CertsClaimable = 'flash.certs-claimable'`

**Translation** (`client/i18n/locales/english/translations.json`):
- Added: `"certs-claimable": "You can now claim the {{certNames}} certification! Visit your settings page to claim your certification."`

### 3. Custom Hook (`client/src/components/helpers/use-claimable-certs-notification.tsx`)
Created `useClaimableCertsNotification()` hook that:
- Uses `useRef` to track if notification has been shown (prevents duplicate notifications)
- Waits for user data to be fully loaded (`complete` state)
- Checks for claimable certifications
- Dispatches flash message with certification names if any are claimable
- Only shows notification once per session

### 4. Integration Points
**Landing Page** (`client/src/pages/index.tsx`):
- Imported and called `useClaimableCertsNotification()` hook

**Learn Page** (`client/src/pages/learn.tsx`):
- Imported and called `useClaimableCertsNotification()` hook

## Certifications Checked
The selector checks the following certifications:
- Responsive Web Design
- JavaScript Algorithms and Data Structures (v8)
- Front End Development Libraries
- Data Visualization
- Relational Database
- Back End Development and APIs
- Quality Assurance
- Scientific Computing with Python
- Data Analysis with Python
- Information Security
- Machine Learning with Python
- College Algebra with Python
- Foundational C# with Microsoft
- Legacy JavaScript Algorithms and Data Structures
- Legacy Front End
- Legacy Back End
- Legacy Data Visualization
- Legacy Information Security and Quality Assurance
- Legacy Full Stack (special case - requires 6 other certifications)

## How It Works

1. User navigates to `/` or `/learn`
2. Hook checks if user data is loaded
3. Selector evaluates all certifications:
   - Skips already claimed certifications
   - Checks if all required project IDs exist in user's `completedChallenges`
4. If any certifications are claimable:
   - Flash message is displayed with certification names
   - Message is dismissible (built-in Flash component feature)
   - Notification only shows once per session

## Prerequisites for Claiming
For a certification to be claimable:
1. User must be logged in
2. User must have a name set in their profile
3. User must have agreed to Academic Honesty Policy (`isHonest === true`)
4. All required projects for that certification must be completed
5. Certification must not already be claimed

## Special Cases

### Legacy Full Stack Certification
Requires completion of 6 specific certifications:
- Responsive Web Design
- Legacy JavaScript Algorithms and Data Structures
- Front End Development Libraries
- Data Visualization (2018)
- Back End Development and APIs
- Legacy Information Security and Quality Assurance

## Testing Recommendations

1. **Test with user who has completed all projects for a certification but hasn't claimed it**
   - Should see flash message on landing/learn page
   - Message should be dismissible
   - Should not show again after dismissal (same session)

2. **Test with user who has no claimable certifications**
   - Should not see any flash message

3. **Test with user who hasn't set their name**
   - Should not see flash message (even if projects are complete)

4. **Test with user who hasn't agreed to Academic Honesty Policy**
   - Should not see flash message (even if projects are complete)

5. **Test with multiple claimable certifications**
   - Should see all certification names in the message

## Files Modified

1. `client/src/redux/selectors.js` - Added selector
2. `client/src/components/Flash/redux/flash-messages.ts` - Added enum
3. `client/i18n/locales/english/translations.json` - Added translation
4. `client/src/components/helpers/use-claimable-certs-notification.tsx` - Created hook
5. `client/src/pages/index.tsx` - Integrated hook
6. `client/src/pages/learn.tsx` - Integrated hook

## Future Improvements

1. **Add link to settings page in flash message** - Currently just mentions settings page
2. **Persist notification dismissal** - Use localStorage to prevent showing across sessions
3. **Add project IDs for legacy certifications** - Currently some legacy cert project IDs may need verification
4. **Show notification after completing final project** - Could trigger immediately after project completion
5. **Add analytics tracking** - Track how many users see and act on the notification
