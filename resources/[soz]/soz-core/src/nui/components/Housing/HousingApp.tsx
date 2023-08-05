import { FunctionComponent, useEffect, useState } from "react";

import { HousingEditor } from './HousingEditor';
import { useKeyPress } from "../../hook/control";

export const HousingApp: FunctionComponent = () => {
    const [showHousing, setShowHousing] = useState<boolean>(null);

    useKeyPress('r', showHousing && )

    return (
        <main className="absolute h-full w-full">
            <HousingEditor />
        </main>
    );
};
