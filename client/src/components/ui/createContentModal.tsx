export const CreateContentModal = () => {
    return <div className="flex justify-center items-center pt-20">
        <div className="bg-[#183B4E] rounded-md min-w-90 h-96 p-5 text-[#DDA853]">
            <div className="font-bold text-4xl pb-6  flex justify-center">Add Content</div>
            <div className="p-1">
                <div className="m-4">
                    <input type="text" className="w-full rounded-md p-2 border"
                        placeholder="Title..." />
                </div>
                <div className="m-4">
                    <input type="text" className="w-full rounded-md p-2 border"
                        placeholder="Link..." />
                </div>
            </div>
        </div>
    </div>

}