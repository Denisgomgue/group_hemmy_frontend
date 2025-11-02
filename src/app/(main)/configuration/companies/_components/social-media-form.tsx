"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

interface SocialMediaData {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
}

interface SocialMediaFormProps {
    value: string;
    onChange: (value: string) => void;
}

export function SocialMediaForm({ value, onChange }: SocialMediaFormProps) {
    const [ socialData, setSocialData ] = useState<SocialMediaData>(() => {
        try {
            return JSON.parse(value || "{}");
        } catch {
            return {
                facebook: "",
                instagram: "",
                linkedin: "",
                youtube: "",
                tiktok: "",
            };
        }
    });

    const handleSocialChange = (platform: keyof SocialMediaData, url: string) => {
        const newData = { ...socialData, [ platform ]: url };
        setSocialData(newData);
        onChange(JSON.stringify(newData));
    };

    const socialPlatforms = [
        {
            key: "facebook" as const,
            label: "Facebook",
            icon: Facebook,
            placeholder: "https://facebook.com/tu-empresa"
        },
        {
            key: "instagram" as const,
            label: "Instagram",
            icon: Instagram,
            placeholder: "https://instagram.com/tu-empresa"
        },
        {
            key: "linkedin" as const,
            label: "LinkedIn",
            icon: Linkedin,
            placeholder: "https://linkedin.com/company/tu-empresa",
        },
        {
            key: "youtube" as const,
            label: "YouTube",
            icon: Youtube,
            placeholder: "https://youtube.com/@tu-empresa"
        },
        {
            key: "tiktok" as const,
            label: "TikTok",
            icon: null,
            placeholder: "https://tiktok.com/@tu-empresa"
        },
    ];

    return (
        <Card className="border-primary/20">
            <CardHeader>
                <CardTitle className="text-lg">Redes Sociales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {socialPlatforms.map(({ key, label, icon: Icon, placeholder }) => (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="flex items-center gap-2">
                            {Icon ? <Icon className="h-4 w-4" /> : <span className="text-sm font-bold">TT</span>}
                            {label}
                        </Label>
                        <Input
                            id={key}
                            type="url"
                            value={socialData[ key ]}
                            onChange={(e) => handleSocialChange(key, e.target.value)}
                            placeholder={placeholder}
                            className="focus:border-primary focus:ring-primary/20"
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
