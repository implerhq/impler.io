import { Button } from '@impler/react';

export const App = () => {
  return (
    <div className="App">
      <Button
        projectId={import.meta.env.VITE_PROJECT_ID}
        accessToken={import.meta.env.VITE_ACCESS_TOKEN}
        template={import.meta.env.VITE_TEMPLATE}
        primaryColor={import.meta.env.VITE_PRIMARY_COLOR}
      />
    </div>
  );
};
