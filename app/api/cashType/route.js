import { NextResponse } from 'next/server';
import { Connect } from '@/lib/utils/Db';
import { CashtypeModel } from '@/lib/Models';


export const GET = async () => {
  try {
    await Connect();
    const cashTypes = await CashtypeModel.find({}).sort({_id:'desc'});
    return NextResponse.json( cashTypes );
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ message: 'Failed to fetch cashTypes' }, { status: 500 });
  }
}



export const POST = async (Request) => {
  try {
    await Connect();
    const { name } = await Request.json();
    const cashTypes = await CashtypeModel.create({ name });
    return NextResponse.json(cashTypes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "POST Error", err }, { status: 500 });
  }
}