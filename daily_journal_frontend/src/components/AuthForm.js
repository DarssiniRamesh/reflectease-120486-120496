/*
 * This component is now obsolete and replaced by Clerk UI.
 * Usage of this component should be removed from all callers.
 */
const AuthForm = () => {
  return (
    <div style={{ padding: 30, maxWidth: 420, margin: "auto", color: "#888" }}>
      Auth is now handled by Clerk (<a href="https://clerk.com/docs/component-reference">see docs</a>).
      Please remove references to AuthForm and use Clerk <SignIn />, <SignUp /> as directed in App.js.
    </div>
  );
};

export default AuthForm;
