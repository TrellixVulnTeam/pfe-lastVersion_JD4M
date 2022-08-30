/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Home',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/events',
        role: ''
    },
    {
        id: 'example',
        title: 'Events',
        type: 'basic',
        icon: 'heroicons_outline:fire',
        link: '/events/list',
        role: ''
    },
    {
        id: 'home',
        title: 'Home',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/events',
        role: 'ROLE_USER'
    },
    {
        id: 'example',
        title: 'Events',
        type: 'basic',
        icon: 'heroicons_outline:fire',
        link: '/events/list',
        role: 'ROLE_USER'
    },
    {
        id: 'extract-programs',
        title: 'Extract programs',
        type: 'basic',
        icon: 'heroicons_outline:fire',
        link: '/admin/extract-events',
        role: 'ROLE_ADMIN'
    },
    {
        id: 'manage-programs',
        title: 'Manage programs',
        type: 'basic',
        icon: 'heroicons_outline:fire',
        link: '/admin/manage-events',
        role: 'ROLE_ADMIN'
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
