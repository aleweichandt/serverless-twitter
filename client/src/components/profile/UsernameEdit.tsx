import React from 'react'
import { User } from "../../types/User";
import { Input, Form, Button } from 'semantic-ui-react';

interface UsernameEditProps {
    user: User
    loading: boolean
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

const UsernameEdit = ({ user, loading, onChange, onSubmit }: UsernameEditProps) => (
    <Form onSubmit={onSubmit}>
        <Form.Field
            label="Username"
            placeholder={user.username}
            control={Input}
            onChange={onChange}
        />
        <Button type="submit" loading={loading}>Submit</Button>
    </Form>
) 

export default UsernameEdit