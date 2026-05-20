# Firebase Security Specification

## Data Invariants
1. **Schools**: 
   - Every school must have an `ownerId` matching the creator's UID.
   - Only the owner or a SuperAdmin can update school details.
   - Fields like `id` and `ownerId` are immutable.
   - All string fields have size limits.
2. **Inquiries**:
   - Any user (even unauthenticated, if enabled) can create an inquiry.
   - Only the school owner (found by `get(/databases/$(database)/documents/schools/$(schoolId)).data.ownerId`) can read inquiries for that school.
3. **Websites**:
   - Every website config must have a `schoolId`.
   - Only the school owner can create or update the website configuration.
4. **Users**:
   - Users can only read and write their own profile.
   - `role` field cannot be self-assigned (must be set by admin or system).

## The Dirty Dozen Payloads

### 1. Identity Spoofing (Schools)
Attempt to create a school with an `ownerId` that doesn't match the current user.
```json
{
  "name": "Hacker School",
  "ownerId": "some-other-uid",
  "region": "Hhohho",
  "town": "Mbabane"
}
```
**Expected**: PERMISSION_DENIED

### 2. Privilege Escalation (Users)
Attempt to update own profile to become a `SuperAdmin`.
```json
{
  "role": "SuperAdmin"
}
```
**Expected**: PERMISSION_DENIED

### 3. Resource Poisoning (Schools)
Attempt to create a school with an extremely large description.
```json
{
  "description": "very long string..." 
}
```
**Expected**: PERMISSION_DENIED (size check)

### 4. Orphaned Record (Inquiries)
Attempt to create an inquiry for a non-existent school.
```json
{
  "schoolId": "ghost-school-id",
  "parentName": "John Doe"
}
```
**Expected**: PERMISSION_DENIED (exists check)

### 5. Cross-School Access (Inquiries)
Attempt to read inquiries for a school I don't own.
```json
// Querying /inquiries where schoolId == 'someone-elses-school'
```
**Expected**: PERMISSION_DENIED

### 6. Immutable Field Modification (Schools)
Attempt to change `ownerId` after creation.
```json
{
  "ownerId": "new-owner-uid"
}
```
**Expected**: PERMISSION_DENIED

### 7. Unauthorized Website Update
Attempt to update a school's website config without being the owner.
```json
{
  "headline": "Defaced!"
}
```
**Expected**: PERMISSION_DENIED

### 8. Invalid ID Injection
Attempt to create a document with an ID containing malicious characters.
```json
// ID: "../../etc/passwd"
```
**Expected**: PERMISSION_DENIED

### 9. Price Manipulation (Subscriptions)
Attempt to update own subscription status directly.
```json
{
  "subscriptionPlan": "Enterprise"
}
```
**Expected**: PERMISSION_DENIED

### 10. Blanket List Execution
Attempt to list all user profiles.
```json
// getDocs(collection(db, 'users'))
```
**Expected**: PERMISSION_DENIED (must filter by own UID)

### 11. Bypassing Verification
Attempt to write as an unverified user when verification is required.
**Expected**: PERMISSION_DENIED

### 12. State Shortcut (Inquiries)
Attempt to set an inquiry status to 'closed' before it's been created or responded to (if there's a state machine).
**Expected**: PERMISSION_DENIED
