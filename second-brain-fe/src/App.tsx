// import { useState } from 'react'
import { Button } from "./components/ui/Button"
import { Sidebar } from "./components/ui/Sidebar"
import { PlusIcon } from "./components/icons/PlusIcon"
import { ShareIcon } from "./components/icons/ShareIcon"



function App() {

  return (
    <div className="flex justify-between">
      <div>{<Sidebar />}</div>

      <div className="flex justify-end">
        <div className="">
          <Button
            size="md" text="Add content"
            bg_color="green" fullWidth={false}
            startIcon={<PlusIcon />}
          />
        </div>
        <div className="">
          <Button
            size="md" text="Share Brain"
            bg_color="green" fullWidth={false}
            startIcon={<ShareIcon />}
          />
        </div>
      </div>

    </div>
  )
}

export default App
