// import { useState } from 'react'
import { Button } from "./components/ui/Button"
import { Sidebar } from "./components/ui/Sidebar"
import { PlusIcon } from "./components/icons/PlusIcon"
import { ShareIcon } from "./components/icons/ShareIcon"

function App() {

  return (
    <div className="flex justify-between bg-purple-300">
      <div>{<Sidebar />}</div>

      <div className="flex justify-end">
        <div className="">
          <Button
            size="md" text="Add content"
            bg_color="purple" fullWidth={false}
            startIcon={<PlusIcon />}
          />
        </div>
        <div className="">
          <Button
            size="md" text="Share Brain"
            bg_color="purple" fullWidth={false}
            startIcon={<ShareIcon />}
          />
        </div>
      </div>

    </div>
  )
}

export default App
