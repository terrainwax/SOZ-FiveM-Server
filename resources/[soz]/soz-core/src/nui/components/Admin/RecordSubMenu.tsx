import { SozRole } from '@public/core/permissions';
import { FunctionComponent } from 'react';

import { MenuContent, MenuItemButton, MenuItemSubMenuLink, MenuTitle, SubMenu } from '../Styleguide/Menu';

export type RecordSubMenuProps = {
    banner: string;
    permission: SozRole;
};

export const RecordSubMenu: FunctionComponent<RecordSubMenuProps> = ({ banner, permission }) => {
    return (
        <SubMenu id="record">
            <MenuTitle banner={banner}>Tu fais de la musique ?</MenuTitle>
            <MenuContent>
                <MenuItemSubMenuLink id="record-add">👨‍💻 Créer un album</MenuItemSubMenuLink>
                <MenuItemSubMenuLink id="record-add">👨‍💻 Créer un Artiste</MenuItemSubMenuLink>
            </MenuContent>
        </SubMenu>
    );
};

export const RecordAddSubMenu: FunctionComponent<RecordSubMenuProps> = ({ banner, permission }) => {
    return (
        <SubMenu id="record-add">
            <MenuTitle banner={banner}>Tu fais de la musique ?</MenuTitle>
            <MenuContent>
            </MenuContent>
        </SubMenu>
    );
}