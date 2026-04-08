'use client'

import { UserAddressState } from "../lib/actions";
import { createUserAddress } from "../lib/actions";
import { useActionState, useRef, useState} from "react";
import { Button } from "./Button";
import Autocomplete from 'react-google-autocomplete';
import Link from "next/link";

export default function UserAddressForm({user_id}:{user_id : string})
{
    const initialState: UserAddressState = {message:'', errors:{}};
    const CreateUserAddress = createUserAddress.bind(null, user_id);
    const [state, formAction, isPending] = useActionState(CreateUserAddress, initialState);
    const [previewCoords, setPreviewCoords] = useState<{lat: number, lng: number} | null>(null);


    const inputStyles = "block w-full rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500";
    const labelStyles = "mb-2 block text-xs font-medium text-gray-900";
    
    const cityRef = useRef<HTMLInputElement>(null);
    const stateRef = useRef<HTMLInputElement>(null);
    const zipRef = useRef<HTMLInputElement>(null);

    const latRef = useRef<HTMLInputElement>(null);
    const lngRef = useRef<HTMLInputElement>(null);

    const handlePlaceSelected = (place: any) => {
        const addressComponents = place.address_components;

        let city = '';
        let stateCode = '';
        let zip = '';
        
        addressComponents?.forEach((component: any) => {
            const types = component.types;
            if (types.includes('locality')) {
                city = component.long_name; 
            }
            if (types.includes('administrative_area_level_1')) {
                stateCode = component.short_name; 
            }
            if (types.includes('postal_code')) {
                zip = component.long_name; 
            }
        });

        if (cityRef.current) cityRef.current.value = city;
        if (stateRef.current) stateRef.current.value = stateCode;
        if (zipRef.current) zipRef.current.value = zip;

        const lat = place.geometry?.location?.lat();
        const lng = place.geometry?.location?.lng();
        if (latRef.current) latRef.current.value = lat;
        if (lngRef.current) lngRef.current.value = lng;

        if (lat && lng) {
        setPreviewCoords({ lat, lng });
        }
    };

    const getMapUrl = (lat: number, lng: number) => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        // center: Map center
        // zoom: 15 - street level
        // size: width x height
        // markers: pointer
        // key: API Key
        return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},
        ${lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:yellow%7C${lat},
        ${lng}&key=${apiKey}`;
    };
        return (
        <form action={formAction} className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create new Shipping Address</h2>

            <input type="hidden" name="latitude" ref={latRef} />
            <input type="hidden" name="longitude" ref={lngRef} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label htmlFor="label" className={labelStyles}>Address Label(e.g. home, company)</label>
                    <input 
                        type="text" 
                        id="label" 
                        name="label" 
                        className={inputStyles} 
                        required
                    />
                     <div id="label-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.label && state.errors.label.map((error: string) => (
                            <p key={error} className="mt-2 text-sm text-red-500">⚠️ {error}</p>
                        ))}
                    </div>
                </div>
                    
                {/* Recipient Name */}
                <div>
                    <label htmlFor="recipient_name" className={labelStyles}>Recipient Name</label>
                    <input 
                        type="text" 
                        id="recipient_name" 
                        name="recipient_name" 
                        className={inputStyles} 
                        required
                    />
                    <div id="recipient_name-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.recipient_name && state.errors.recipient_name.map((error: string) => (
                            <p key={error} className="mt-2 text-sm text-red-500">⚠️ {error}</p>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="phone_number" className={labelStyles}>Phone Number</label>
                <input 
                    type="tel" 
                    id="phone_number" 
                    name="phone_number" 
                    className={inputStyles} 
                    required
                />
                <div id="phone_number-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.phone_number && state.errors.phone_number.map((error: string) => (
                        <p key={error} className="mt-2 text-sm text-red-500">⚠️ {error}</p>
                    ))}
                </div>
            </div>
            <div>
                <label htmlFor="street_address_1" className={labelStyles}>First Street Address (enter to automatically search)</label>
                
                <Autocomplete
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    onPlaceSelected={handlePlaceSelected}
                    options={{
                        types: ["address"], 
                        componentRestrictions: { country: "us" }, 
                    }}
                    name="street_address_1" 
                    id="street_address_1"
                    className={inputStyles}
                    required
                />
                <div id="street_address_1-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.street_address_1 && state.errors.street_address_1.map((error: string) => (
                        <p key={error} className="mt-2 text-sm text-red-500">⚠️ {error}</p>
                    ))}
                </div>
            </div>

             {previewCoords && (
                <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative">
                    <img 
                        src={getMapUrl(previewCoords.lat, previewCoords.lng)} 
                        alt="Location Preview" 
                        className="w-full h-48 object-cover"
                    />
                </div>
            )}
            <div>
                <label htmlFor="street_address_2" className={labelStyles}>Second Street Address(optional)</label>
                <input 
                    type="text" 
                    id="street_address_2" 
                    name="street_address_2" 
                    className={inputStyles} 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="state" className={labelStyles}>State</label>
                    <input 
                        ref={stateRef}
                        type="text" 
                        id="state" 
                        name="state" 
                        className={inputStyles} 
                        required
                    />
                </div>
                <div>
                    <label htmlFor="city" className={labelStyles}>City</label>
                    <input 
                        ref={cityRef}
                        type="text" 
                        id="city" 
                        name="city" 
                        className={inputStyles} 
                        required
                    />
                </div>
                <div>
                    <label htmlFor="zip_code" className={labelStyles}>ZipCode(optional)</label>
                    <input
                        ref={zipRef} 
                        type="text" 
                        id="zip_code" 
                        name="zip_code" 
                        className={inputStyles} 
                        required
                    />
                </div>
            </div>
            <div aria-live="polite" aria-atomic="true">
                {[state.errors?.state, state.errors?.city, state.errors?.zip_code].flat().filter(Boolean).map((error, index) => (
                     <p key={index} className="mt-1 text-sm text-red-500">⚠️ {error}</p>
                ))}
            </div>

            <div className="flex items-center gap-2 mt-2">
                <input 
                    type="checkbox" 
                    id="is_default" 
                    name="is_default" 
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="is_default" className="text-sm font-medium text-gray-700">
                    Set as default address
                </label>
            </div>

            {/* General Error Message */}
            {state.message && (
                 <p className="mt-4 text-sm text-red-500 text-center font-medium bg-red-50 p-2 rounded">{state.message}</p>
            )}

            {/* Buttons Area */}
            <div className="mt-8 flex gap-3 pt-4 border-t border-gray-100">
                <Link
                    href="/profile"
                    className="flex-1 flex justify-center items-center h-10 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                    Cancel
                </Link>
                <Button 
                    aria-disabled={isPending} 
                    className="flex-1 flex justify-center items-center h-10 rounded-lg bg-red-700 text-white hover:bg-red-600 font-bold shadow-md transition-colors"
                >
                    {isPending ? 'Saving...' : 'Save Address'}
                </Button>
            </div>
        </form>
    );
}