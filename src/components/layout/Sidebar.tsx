import { AlgorithmControls } from '../controls/AlgorithmControls';
import { NetworkEditor } from '../controls/NetworkEditor';

export function Sidebar() {
  return (
    <aside className="flex w-full flex-col gap-4 overflow-y-auto p-3 lg:w-[280px] lg:p-4">
      <AlgorithmControls />
      <NetworkEditor />
    </aside>
  );
}
