import { ResizablePanel } from "@/components/ui/resizable";

export const RoomContentPanel = () => {
	return (
		<ResizablePanel
			defaultSize={100}
			minSize={0}>
			<div className="p-4 h-full flex gap-4 flex-wrap justify-center items-center ">
				{Array.from({ length: 1 }).map((_, index) => (
					<div
						key={index}
						className="min-w-[300px] min-h-[200px] flex items-center justify-center">
						<span>{`Ekran ${index + 1}`}</span>
					</div>
				))}
			</div>
		</ResizablePanel>
	);
};
