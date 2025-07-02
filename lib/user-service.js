import { supabase } from './supabase';

export async function upsertUser(userData) {
    try {
        console.log('=== Storing User Data ===');
        console.log('Input data:', JSON.stringify(userData, null, 2));

        // Make sure we have the required fields
        if (!userData || !userData.id) {
            console.error('Missing required field: id');
            throw new Error('Invalid user data - missing required fields');
        }

        // Prepare the user data for storage, including enterprise data
        const userPayload = {
            jobite_id: userData.id,
            email: userData.email || '',
            role: userData.role || 'user',
            type: userData.type || '',
            // Handle enterprise data if available
            company_name: userData.entreprise ? userData.entreprise.nom : '',
            company_logo: userData.entreprise ? userData.entreprise.logo : '',
            company_sector: userData.entreprise ? userData.entreprise.sector : '',
            company_description: userData.entreprise ? userData.entreprise.description : '',
            last_login: new Date().toISOString()
        };

        console.log('Prepared payload:', JSON.stringify(userPayload, null, 2));

        // First, check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('jobite_id')
            .eq('jobite_id', userData.id)
            .single();

        console.log('Existing user check:', existingUser);

        // Then perform upsert
        const { data, error } = await supabase
            .from('users')
            .upsert(userPayload, {
                onConflict: 'jobite_id',
                returning: true
            });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        console.log('Success! Stored data:', JSON.stringify(data, null, 2));
        console.log('========================');

        return data;
    } catch (error) {
        console.error('Error in upsertUser:', error);
        throw error;
    }
}

export async function getUserById(jobiteId) {
    try {
        if (!jobiteId) {
            throw new Error('jobiteId is required');
        }

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('jobite_id', jobiteId)
            .single();

        if (error) {
            console.error('Failed to fetch user:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}