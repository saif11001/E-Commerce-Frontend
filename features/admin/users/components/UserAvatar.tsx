import { AdminUser } from "@/store/Adminuserstore";

export default function UserAvatar({ user, className = "h-11 w-11" }: { user: AdminUser; className?: string }) {
    if (user.image?.url) {
        return (
            <img
                src={user.image.url}
                alt={user.name}
                draggable={false}
                className={`${className} shrink-0 rounded-full object-cover`}
            />
        );
    }
    return (
        <div
            className={`${className} flex shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold uppercase text-gray-600`}
        >
            {user.name?.charAt(0) || "?"}
        </div>
    );
}