// import { useState } from 'react'
import { Button } from "./components/ui/Button"
import { PlusIcon } from "./components/icons/PlusIcon"
import { ShareIcon } from "./components/icons/ShareIcon"


function App() {

  return (
    <div className="flex justify-end p-10">
      <Button
        size="md" text="Add content"
        bg_color="green" fullWidth={false}
        startIcon={<PlusIcon />}
      />
      <Button
        size="md" text="Share Brain"
        bg_color="green" fullWidth={false}
        startIcon={<ShareIcon />}
      />
    </div>
  )
}

export default App
