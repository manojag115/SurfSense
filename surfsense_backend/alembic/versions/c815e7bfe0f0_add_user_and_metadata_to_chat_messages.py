"""add_user_and_metadata_to_chat_messages

Revision ID: c815e7bfe0f0
Revises: 59
Create Date: 2026-01-09 11:44:51.997175

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'c815e7bfe0f0'
down_revision: Union[str, None] = '59'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add user_id column (nullable, FK to user table)
    op.add_column('new_chat_messages', sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index(op.f('ix_new_chat_messages_user_id'), 'new_chat_messages', ['user_id'], unique=False)
    op.create_foreign_key('fk_new_chat_messages_user_id', 'new_chat_messages', 'user', ['user_id'], ['id'], ondelete='SET NULL')
    
    # Add message_metadata column (JSONB, nullable)
    op.add_column('new_chat_messages', sa.Column('message_metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # Remove message_metadata column
    op.drop_column('new_chat_messages', 'message_metadata')
    
    # Remove user_id column and its FK/index
    op.drop_constraint('fk_new_chat_messages_user_id', 'new_chat_messages', type_='foreignkey')
    op.drop_index(op.f('ix_new_chat_messages_user_id'), table_name='new_chat_messages')
    op.drop_column('new_chat_messages', 'user_id')
