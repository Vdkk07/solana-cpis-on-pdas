use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    program::invoke_signed,
    pubkey::Pubkey,
    system_instruction::create_account,
    system_program::ID as SYSTEM_PROGRAM_ID,
};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let iter = &mut accounts.iter();
    let user_acc = next_account_info(iter)?;
    let _pda = next_account_info(iter)?;
    let _system_program = next_account_info(iter)?;

    let seeds = &[b"user", user_acc.key.as_ref()];

    let (_pda_pub_key, bump) = Pubkey::find_program_address(seeds, &program_id);

    let ix = create_account(
        &user_acc.key,
        &_pda_pub_key,
        1000000000,
        8,
        &SYSTEM_PROGRAM_ID,
    );

    let signer_seeds = &[b"user", user_acc.key.as_ref(), &[bump]];

    invoke_signed(&ix, accounts, &[signer_seeds])?;

    Ok(())
}
